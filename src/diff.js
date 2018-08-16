import {deepEqual} from '../utils';

const ACTION = {
  update: 'update',
  replace: 'replace',
  remove: 'remove',
  insert: 'insert',
  append: 'append',
  move: 'move',
};

export default function diff(oldDOM, newDOM) {
  let patchs = {};
  let walker = {index: 0};
  dfs(oldDOM, newDOM, patchs, walker);
  return patchs;
}

function dfs(oldVnode, newVnode, patchs, walker) {
  let index = walker.index++;
  let curPatches = [];
  if (newVnode) {
    if (newVnode.text !== oldVnode.text) {
      // 替换
      curPatches.push({type: ACTION.replace, vnode: newVnode});
    } else if (oldVnode.tagName === newVnode.tagName && oldVnode.key === newVnode.key) {
      // 节点类型相同，但是key不同，更新即可
      let props = diffProps(oldVnode.props, newVnode.props);
      if (props.length) curPatches.push({type: ACTION.update, props});
      diffChildren(oldVnode.children, newVnode.children, patchs, walker);
    }
  }
  if (curPatches.length) {
    if (patchs[index]) patchs[index].push(...curPatches);
    else patchs[index] = curPatches;
  }
}

function diffProps(oldProps, newProps) {
  let changes = [];
  for (const key in oldProps) {
    // 利用vlaue不存在作为移除属性的判断依据
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

function listHaskey(list) {
  for (let node of list) {
    if ('key' in node) return true;
  }
}

function listDiff(oldList = [], newList = [], patchs, walker) {
  let index = walker.index - 1;
  let oldKeys = getKeys(oldList);
  let newKeys = getKeys(newList);
  let changes = [];
  let list = [];
  if (!patchs[index]) {
    patchs[index] = [];
  }
  oldKeys.forEach((key, oldIndex) => {
    let newIndex = newKeys.indexOf(key);
    if (newIndex === -1) {
      //patchs[index].push({type: 'remove', index: oldIndex});
      console.log('remove: ', key);
    } else if (newIndex !== oldIndex) {
      patchs[index].push({type: 'move', from: oldIndex, to: newIndex});
      console.log('move: ', key, oldIndex, newIndex);
    }
  });
  newKeys.forEach((key, oldIndex) => {
    if (oldKeys.indexOf(key) === -1) {
      //patchs[index].push({type: 'append', vnode: newList[oldIndex]});
      console.log('insert: ', key);
    }
  });
  if (!patchs[index].length) delete patchs[index];
}

function diffChildren(oldChildren, newChildren, patchs, walker) {
  let index = walker.index - 1;
  if (newChildren) {
    oldChildren.slice(newChildren.length).forEach((child, i) => {
      if (!patchs[index]) {
        patchs[index] = [];
      }
      patchs[index].push({type: ACTION.remove, index: i});
    });
    newChildren.slice(oldChildren.length).forEach(child => {
      if (!patchs[index]) {
        patchs[index] = [];
      }
      patchs[index].push({type: ACTION.append, vnode: child});
    });
    listDiff(oldChildren, newChildren, patchs, walker);
    newChildren.forEach((child, i) => {
      if (oldChildren[i] && i >= oldChildren.length - newChildren.length) {
        dfs(oldChildren[i], child, patchs, walker);
      }
    });
  }
}
