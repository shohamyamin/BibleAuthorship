import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { Book, BookFlatNode } from 'src/app/models/Book';
import { IBook } from 'src/app/models/IBook';
import { TextsServiceService } from 'src/app/services/texts-service.service';

const TREE_DATA = {
  Bible: {
    Torah: {
      Genesis: null,
      Exodus: null,
      Leviticus: null,
      Numbers: null,
      Deuteronomy: null,
    },
    Prophets: null,
    Writings: null,
  },
};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<Book[]>([]);

  get data(): Book[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `Book` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `Book`.
   */
  buildFileTree(obj: object, level: number): Book[] {
    return Object.keys(obj).reduce<Book[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Book();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.subBooks = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: Book, inputName: string) {
    if (parent.subBooks) {
      parent.subBooks.push({ name: inputName } as Book);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: Book, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-select-texts-dialog',
  templateUrl: './select-texts-dialog.component.html',
  styleUrls: ['./select-texts-dialog.component.css'],
  providers: [ChecklistDatabase],
})
export class SelectTextsDialogComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<BookFlatNode, Book>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<Book, BookFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: BookFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<BookFlatNode>;

  treeFlattener: MatTreeFlattener<Book, BookFlatNode>;

  dataSource: MatTreeFlatDataSource<Book, BookFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<BookFlatNode>(true /* multiple */);
  mode: string;

  constructor(
    private database: ChecklistDatabase,
    private textsServiceService: TextsServiceService
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<BookFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: BookFlatNode) => node.level;

  isExpandable = (node: BookFlatNode) => node.expandable;

  getChildren = (node: Book): Book[] => node.subBooks;

  hasChild = (_: number, nodeData: BookFlatNode) => nodeData.expandable;

  hasNoContent = (_: number, nodeData: BookFlatNode) => nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: Book, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : new BookFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.subBooks;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
    // tslint:disable-next-line: semicolon
  };

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: BookFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: BookFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: BookFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: BookFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line: no-non-null-assertion
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: BookFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line: no-non-null-assertion
    this.database.updateItem(nestedNode!, itemValue);
  }
  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: BookFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }
  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: BookFlatNode): void {
    let parent: BookFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: BookFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
  /* Get the parent node of a node */
  getParentNode(node: BookFlatNode): BookFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  updateBooks() {
    if (this.mode === 'train') {
      this.textsServiceService.trainBooks = this.checklistSelection.selected;
      this.textsServiceService.trainLoaded = true;
    } else {
      this.textsServiceService.testBooks = this.checklistSelection.selected;
      this.textsServiceService.testLoaded = true;
    }
  }
}
