"use strict";

const { createNode } = require("Node");

function addNode(value, treeNode) {
  return treeNode.getKey() > value
    ? treeNode.leftChild === undefined
      ? treeNode.insertChild(value)
      : addNode(value, treeNode.leftChild)
    : treeNode.rightChild === undefined
      ? treeNode.insertChild(value)
      : addNode(value, treeNode.rightChild);
}

function findNode(value, rootNode) {
  if (rootNode === undefined) {
    return null;
  } else {
    const nodeValue = rootNode.getKey();
    return nodeValue === value
      ? rootNode
      : nodeValue < value
        ? findNode(value, rootNode.rightChild)
        : findNode(value, rootNode.leftChild);
  }
}

const isAListThis = Array.isArray;

function flatReducer(flatArray, arg) {
  return isAListThis(arg) ? flatArray.concat(flat(arg)) : flatArray.concat(arg);
}

function flat(args) {
  return args.reduce(flatReducer, []);
}

/* Declaring tree prototype */
const Tree = {
  setRootNodeWith(value) {
    this.rootNode = createNode(value);
  },
  insert(...args) {
    this.insertList(flat(args));
    return this;
  },
  insertList(args) {
    args.forEach(arg => this.add(arg));
  },
  add(value) {
    const { rootNode } = this;
    rootNode === undefined
      ? this.setRootNodeWith(value)
      : addNode(value, rootNode);

    return this;
  },
  contain(...args) {
    const nodes = flat(args).map(arg => findNode(arg, this.rootNode));
    const everyNodeIsFinded = nodes.every(node => node);
    return everyNodeIsFinded ? nodes : false;
  },
  remove(arg){
    const nodes = this.contain(arg);
    if(nodes !== false){

      const node = nodes[0];

      if(!node.hasChildrens()){
        const {parentNode} = node;
        if(parentNode === undefined){
          this.rootNode = undefined;
        }
        else if(parentNode.leftChild && parentNode.leftChild.getKey() === node.getKey()){
          parentNode.leftChild = undefined;
        }else{
          parentNode.rightChild = undefined;
        }
      }
      else if(node.hasOneChild()){
        const {parentNode,leftChild} = node;
        const childSide = (leftChild !== undefined) ? "leftChild":"rightChild";
        const child = node[childSide];

        if(parentNode === undefined){
          this.rootNode = child;
        }
        else if(parentNode.leftChild && parentNode.leftChild.getKey() === node.getKey()){
          parentNode.leftChild = child;
        }
        else{
          parentNode.rightChild = child;
        }

        child.parentNode = parentNode;
      }
      else{
        const succesor = minOf(node.rightChild);
        this.remove(succesor.getKey());
        node.setKey(succesor.getKey());
      }
    }

    return this;
  }
};

function createEmptyTree() {
  return Object.assign(Object.create(Tree), { rootNode: undefined });
}

function createNewTreeWith(arg) {
  const newTree = createEmptyTree();
  arg.forEach(a => newTree.insert(a));
  return newTree;
}

function createTree(...args) {
  return args.length === 0 ? createEmptyTree() : createNewTreeWith(args);
}

function minOf(rootNode) {
  return rootNode.leftChild === undefined
    ? rootNode
    : minOf(rootNode.leftChild);
}

module.exports = {
  createTree,
  minOf
};
