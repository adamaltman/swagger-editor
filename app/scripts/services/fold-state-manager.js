'use strict';

/*
 * Manages the fold state of nodes in the code and preveiw tree
*/
SwaggerEditor.service('FoldStateManager', function FoldStateManager(
  $localStorage) {

  var changeListeners = new Set();

  // set fold state of all root nodes to false as their default value
  $localStorage.$default({
    foldState: {
      info: {
        $folded: false
      },
      paths: {
        $folded: false
      },
      definitions: {
        $folded: false
      }
    }
  });

  /*
   * Returns a node from the foldState tree with a given path
   *
   * @param {array<string>} path - the path to the specific node
  */
  function walkToNode(path) {
    var current = $localStorage.foldState;

    while (path.length) {
      current = current[path.shift()];

      if (!current) {
        return null;
      }
    }

    return current;
  }

  /**
   * invoke change listeners
   */
  function invokeChangeListeners() {
    var args = arguments;
    changeListeners.forEach(function(fn) {
      fn.apply(null, args);
    });
  }

  /*
   * Folds a node at a specific path
   *
   * @param {array<string>} path - the path to the specific node
   * @param {boolean} value - optional. If true for setting fold status to
   *   folded. If value is false it will be set the folded state to unfolded.
   *   If value is not provided, it will toggle the fold state
  */
  function changeFold(path, value) {
    var node = walkToNode(path);

    // if node doesn't exists silently ignore the operation
    if (node) {

      // if vlaue is not provided, toggle
      if (value === undefined) {
        value = !node.$folded;
      }

      node.$folded = value;
      invokeChangeListeners(node, value);
    }
  }

  /**
   * Folds a node
   * @param  {array<string>} path - an array of keys to rach to the node
  */
  this.fold = function (path) {
    changeFold(path, true);
  };

  /**
   * Unfolds a node
   * @param  {array<string>} path - an array of keys to rach to the node
  */
  this.unfold = function (path) {
    changeFold(path, false);
  };

  /**
   * Toggles the fold state of a node
   * @param {array<string>} path - array of keys to rach to the node
  */
  this.toggleFold = function (path) {
    changeFold(path)
  };

  /**
   * Folda all nodes that match the path
   * @param {array<string>} path - array of keys/wildcards to rach to the node
  */
  this.foldAll = function (path) {

  };

  /**
   * Unfold all nodes that match the path
   * @param {array<string>} path - array of keys/wildcards to rach to the node
  */
  this.unfoldAll = function (path) {

  };

  /**
   * Toggle fold state of all nodes that match the path
   * @param {array<string>} path - array of keys/wildcards to rach to the node
  */
  this.toggleFoldAll = function (path) {

  };

  /**
   * Determines if a node is folded
   * @param {array<string>} path - array of keys/wildcards to rach to the node
   * @return {Boolean} true if node is folded, false otherwise
   *
  */
  this.isFolded = function (path) {
    var node = walkToNode(path);

    if (node) {
      return node.$folded;
    }
  };

  /**
   * Determines if all nodes matching path are folded
   * @param {array<string>} path - array of keys/wildcards to rach to the node
   * @return {Boolean} [description]
  */
  this.isAllFolded = function (path) {

  };

  /**
   * Adds a change listener for when a fold state changes in the foldState tree
   * @param  {Function} fn the callback function
   */
  this.onFoldChanged = function (fn) {
    changeListeners.add(fn);
  };
});
