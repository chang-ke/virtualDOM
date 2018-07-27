const ACTION = {update: 1, replace: 2, remove: 3, insert: 4, move: 5, append: 6};

export default function diff(oldDOM, newDOM) {
  let patches = {};
  dfs(oldDOM, newDOM, 0, patches);
  return patches;
}

function dfs(oldVnode, newVnode, index, patches) {
  let curPatches = [];
  if (newVnode) {
    // 节点类型相同，但是key不同，更新即可
    if (newVnode.type === oldVnode.type && newVnode.key === oldVnode.key) {
      let props = diffProps(oldVnode.props, newVnode.props);
      if (props.length) curPatches.push({type: ACTION.update, props});
      diffChildren(oldVnode.children, newVnode.children, index, patches);
    } else {
      // 否则需要替换
      curPatches.push({type: ACTION.replace, vnode: newVnode});
    }
  }
  if (curPatches.length) {
    if (patches[index]) patches[index].push(...curPatches);
    else patches[index] = curPatches;
  }
}

function diffProps(oldProps, newProps) {
  let changes = [];
  for (const key in oldProps) {
    // 利用vlaue === undefined 作为移除属性的判断依据
    if (!(key in newProps)) {
      changes.push({key});
    }
  }
  for (const key in newProps) {
    // 新旧props都有，但是值不同
    if (key in oldProps && oldProps[key] !== newProps[key]) {
      changes.push({key, value: newProps[key]});
    }
    // 旧属性中没有的新属性
    if (!(key in oldProps)) {
      changes.push({key, value: newProps[key]});
    }
  }
  return changes;
}

function getKeys(list = []) {
  const keys = [];
  list.forEach(({text, key}) => {
    if (text) {
      keys.push(text);
    } else {
      keys.push(key);
    }
  });
  return keys;
}

function listDiff(oldList = [], newList = [], index, patches) {
  let oldKeys = getKeys(oldKeys);
  let newKeys = getKeys(newKeys);
  let changes = [];
  let list = [];
  oldList.forEach(node => {
    let key = node.key || node.text;
    if (newKeys.indexOf(key) !== -1) {
      list.push(key);
    } else {
      list.push(null);
    }
  });
  let len = list.length - 1;
  for (let i = len; i >= 0; --i) {
    if (!list[i]) {
      list.splice(i, 1);
      changes.push({
        type: ACTION.remove,
        index: 1,
      });
    }
  }
  newList.forEach((node, i) => {
    let key = node.key || node.text;
    let index = list.indexOf(key);
    if (index === -1 || !key) {
      changes.push({
        type: ACTION.insert,
        node: node,
        indexL: i,
      });
      list.splice(i, 0, key);
    } else {
      if (index !== i) {
        changes.push({
          type: ACTION.move,
          from: index,
          to: i,
        });
        move(list, index, i);
      }
    }
  });
  return {changes, list};
}

function diffChildren(oldChildren = [], newChildren = [], index, patches) {
  let {changes, list} = listDiff(oldChildren, newChildren, index, patches);
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].push(...changes);
    } else {
      patches[index] = changes;
    }
  }
  let last = null;
  oldChildren.forEach((node, i) => {
    let child = node.children;
    if (child) {
      index = last && last.children ? index + last.children.length + 1 : index + 1;
      let newNode = newChildren[list.indexOf(node.key)];
      if (newNode) {
        dfs(node, newNode, index, patches);
      }
    } else {
      index += 1;
    }
    last = node;
  });
}
