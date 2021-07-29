import { Component } from '@angular/core';
import {
  TreeItemDropEvent,
  DropPosition
} from '@progress/kendo-angular-treeview';

@Component({
  selector: 'my-app',
  template: `
    <div class="example-config">
      <input
        type="checkbox"
        id="allow-copy"
        class="k-checkbox"
        name="allow-copy"
        [(ngModel)]="allowCopy"
      />
      <label for="allow-copy" class="k-checkbox-label">
        <strong>Allow Copy</strong> (hold the CTRL key on drop to copy the
        dragged item)
      </label>
    </div>
    <div class="example-container">
      <div>
        <h5>Generation Milestone</h5>
        <kendo-treeview
          #listA
          [dropZoneTreeViews]="[listB]"
          kendoTreeViewHierarchyBinding
          [childrenField]="'items'"
          kendoTreeViewDragAndDrop
          [allowCopy]="allowCopy"
          kendoTreeViewDragAndDropEditing
          emptyItemPlaceholder
          kendoTreeViewExpandable
          [expandBy]="'id'"
          [textField]="'text'"
          [nodes]="furnishing"
          [expandedKeys]="[1, 5]"
          (nodeDrop)="handleDrop($event)"
        >
          <ng-template kendoTreeViewNodeTemplate let-dataItem>
            {{ dataItem.text }}
            <span style="padding-left:20px;"
              [ngClass]="iconEditClass(dataItem)"
              *ngIf="dataItem.isgen === true"
            ></span>
            <span style="padding-left:10px;"
              [ngClass]="iconClass(dataItem)"
              *ngIf="dataItem.isgen === true"
            ></span>
          </ng-template>
        </kendo-treeview>
      </div>
    </div>
  `,
  styles: [
    `
      .example-container {
        display: flex;
      }
      .example-container > div {
        flex: 1;
      }
    `
  ]
})
export class AppComponent {
  public allowCopy = true;

  public furnishing: any[] = [
    {
      id: 2,
      text: 'G1',
      isgen: true,
      items: [
        { id: 4, text: 'Concept' },
        { id: 5, text: 'Design Freeze' },
        { id: 6, text: 'V&V' },
        { id: 7, text: 'EFS' },
        { id: 8, text: 'Study Approval, Setup, Initiation' },
        { id: 9, text: 'Trial enrollment' },
        { id: 10, text: 'Patient Follow Up' },
        { id: 11, text: 'Data Analysis & Submission' },
        { id: 12, text: 'Reg Review & Approval' },
        { id: 13, text: 'Available to Sell' }
      ]
    },
    {
      id: 3,
      text: 'G2',
      isgen: true,
      items: [
        { id: 4, text: 'Concept' },
        { id: 5, text: 'Design Freeze' },
        { id: 6, text: 'V&V' },
        { id: 7, text: 'EFS' },
        { id: 8, text: 'Study Approval, Setup, Initiation' },
        { id: 9, text: 'Trial enrollment' },
        { id: 10, text: 'Patient Follow Up' },
        { id: 11, text: 'Data Analysis & Submission' },
        { id: 12, text: 'Reg Review & Approval' },
        { id: 13, text: 'Available to Sell' }
      ]
    }
  ];

  public maintenance: any[] = [
    { id: 13, text: 'Derek', isuser: true },
    { id: 13, text: 'Ijaz', isuser: true },
    { id: 13, text: 'Umair', isuser: true },
    { id: 13, text: 'Faisal', isuser: true }
  ];

  public generation: any[] = [
    { id: 13, text: 'G1' },
    { id: 13, text: 'G2' },
    { id: 13, text: 'G3' },
    { id: 13, text: 'G4' }
  ];

  public handleDrop(event: TreeItemDropEvent): void {
    // prevent the default to prevent the drag-and-drop directive from emitting `addItem` and inserting items with duplicate IDs
    if (this.allowCopy && event.originalEvent.ctrlKey) {
      event.preventDefault();

      // clone the item and its children and assign them new IDs
      const itemWithNewId = this.assignNewIds(
        event.sourceItem.item.dataItem,
        'id',
        'items'
      );

      // if the target is an empty placeholder, remove it and push the new item to the destination tree nodes
      if (event.destinationItem.item.dataItem.placeholder) {
        const placeholderItemIndex = event.destinationTree.nodes.indexOf(
          event.destinationItem.item.dataItem
        );
        event.destinationTree.nodes.splice(
          placeholderItemIndex,
          1,
          itemWithNewId
        );
        return;
      }

      // manually insert the new item and its children at the targeted position
      if (event.dropPosition === DropPosition.Over) {
        event.destinationItem.item.dataItem.items =
          event.destinationItem.item.dataItem.items || [];
        event.destinationItem.item.dataItem.items.push(itemWithNewId);

        if (
          !event.destinationTree.isExpanded(
            event.destinationItem.item.dataItem,
            event.destinationItem.item.index
          )
        ) {
          event.destinationTree.expandNode(
            event.destinationItem.item.dataItem,
            event.destinationItem.item.index
          );
        }
      } else {
        const parentChildren: any[] = event.destinationItem.parent
          ? event.destinationItem.parent.item.dataItem.items
          : event.destinationTree.nodes;

        const shiftIndex = event.dropPosition === DropPosition.After ? 1 : 0;
        const targetIndex =
          parentChildren.indexOf(event.destinationItem.item.dataItem) +
          shiftIndex;

        parentChildren.splice(targetIndex, 0, itemWithNewId);
      }
    }
  }

  // recursively clones and assigns new ids to the root level item and all its children
  private assignNewIds(item: any, idField: string, childrenField: string): any {
    const result = Object.assign({}, item, { [idField]: Math.random() });

    if (result[childrenField] && result[childrenField].length) {
      result[childrenField] = result[childrenField].map(childItem =>
        this.assignNewIds(childItem, idField, childrenField)
      );
    }

    return result;
  }

  public iconClass({ text, items }: any): any {
    return {
      'k-i-delete': true,
      'k-icon': true,
    };
  }
    public iconEditClass({ text, items }: any): any {
        return {
          'k-icon': true,
          'k-i-edit': true
        };
  }
}
