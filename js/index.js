// ====================================
// Item Controller
// ====================================
var itemController = (function() {

  var Item = function(id, description) {
    this.id = id;
    this.description = description;
  };
  
  var data = {
    pros: [],
    cons: []
  };
  
  return {
    addItem: function(type, description) {
      var newItem, ID;
      
      // Create new item ID
      if (data[type].length > 0) {
        ID = data[type][data[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      // Create new item and add to array
      newItem = new Item(ID, description);
      data[type].push(newItem);
      
      return newItem;
    },
    
    removeItem: function(type, ID)  {
      var IDs, index;
      
      IDs = data[type].map(function(current) {
        return current.id;
      });
      
      index = IDs.indexOf(ID);
      
      if (index !== -1) {
        data[type].splice(index, 1);
      }
    },
    
    getTotal: function(type) {
      var total = data[type].length;
      return total;
    },
    
    logData: function() {
      console.log(data);
    }
  };

})();

// ====================================
// UI Controller
// ====================================
var uiController = (function() {
  
  // List of HTML classes
  var elClassList = {
    listContainer: '.list__container',
    inputDesc: '.add-item__description',
    inputType: '.add-item__type',
    addBtn:  '.add-item__btn',
    deleteBtn: '.button--delete',
    pros: '.pros',
    cons: '.cons',
    list: '.list',
    listHeading: '.list__heading',
    listItemCount: '.list-item--count',
    hidden: '.hidden',
    visuallyHidden: '.visually-hidden'
  }
  
  // Set animation classes
  var animateIn = function(el) {
    setTimeout(function() {
      el.classList.add('js--show');
    }, 10);
  }

  return {
    getInput: function() {
      var typeVal;
      
      if (document.querySelector(elClassList.inputType).checked) {
        typeVal = 'pros';  
      } else {
        typeVal = 'cons';
      }
      
      return {
        description: document.querySelector(elClassList.inputDesc).value,
        type: typeVal
      };
    },
    
    addListItem: function(object, type, count) {
      var itemHtml, newItemHtml, element, parent, selectedType, counter, newLi;
      
      // Create HTML with placeholder text
      itemHtml = '<li class="list-item" id="%type%-%id%"><p class="list-item__title">%description%</p><button class="button button--delete" title="Delete this item"><span class="visually-hidden">Delete</span></button></li>';
      
      // Check the item type
      parent = document.querySelector('.' + type);
      element = parent.querySelector(elClassList.list);
      
      // Replace placeholder text with new item data
      newItemHtml = itemHtml.replace('%type%', type);
      newItemHtml = newItemHtml.replace('%id%', object.id);
      newItemHtml = newItemHtml.replace('%description%', object.description);
      
      // Insert HTML into appropriate list
      element.insertAdjacentHTML('afterbegin', newItemHtml);
      
      newLi = element.getElementsByClassName('list-item')[0];
      animateIn(newLi);
    },
    
    removeListItem: function(selectorID, type, count) {
      var element, counter;

      element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);      
    },
    
    updateItemCount: function(type, count) {
      var parent, counter;

      parent = document.querySelector('.' + type);
      counter = parent.querySelector(elClassList.listItemCount);

      counter.innerHTML = count;
    },
    
    clearInput: function() {
      var input;
      
      input = document.querySelector(elClassList.inputDesc);
      input.value = '';
      input.focus();
    },
    
    getClassList: function() {
      return elClassList;
    }
  };

})();

// ====================================
// Application Controller
// ====================================
var controller = (function(itemCtrl, uiCtrl) {
  var elClassList = uiCtrl.getClassList();
  
  // Event listeners that will be set when init() runs
  var setupEventListeners = function() {  
    // Add new items
    document.querySelector(elClassList.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', keyPressAddItem);
    
    // Delete items
    document.querySelector(elClassList.listContainer).addEventListener('click', ctrlRemoveItem);
  };

  // Add on key press
  var keyPressAddItem = function(event) {
    var key = 13; // 'return' keyCode
    if (event.keyCode === key || event.which === key) {
      ctrlAddItem();
    }
  };
  
  var ctrlAddItem = function() {
    var input, newItem, count;
    
    // Get input data
    input = uiCtrl.getInput();
    
    if (input.description !== "") {
      // Add item to item controller data'
      newItem = itemCtrl.addItem(input.type, input.description);
      count = itemCtrl.getTotal(input.type);
      
      // Add item to UI
      uiCtrl.addListItem(newItem, input.type, count);
      
      // Update count
      uiCtrl.updateItemCount(input.type, count);

      // Clear description input
      uiCtrl.clearInput();
    }
  };
  
  var ctrlRemoveItem = function(event) {
    var itemID, splitID, type, ID, count;
    
    // Check ID of item being removed
    itemID = event.target.parentNode.id;
    
    if(itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }
    
    if (event.target && event.target.matches(elClassList.deleteBtn)) {
      // Remove the item from data array and UI
      itemCtrl.removeItem(type, ID);
      uiCtrl.removeListItem(itemID, type);

      // Update count
      count = itemCtrl.getTotal(type);
      uiCtrl.updateItemCount(type, count); 
    }
  }
  
  return {
    init: function() {
      setupEventListeners();
    }
  };

  })(itemController, uiController);

// Fire up the app controller
controller.init();