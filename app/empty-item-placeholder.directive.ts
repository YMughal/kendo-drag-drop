import { Directive, AfterViewInit } from '@angular/core';
import { TreeViewComponent, TreeItemDropEvent, TreeItemDragStartEvent, DropPosition } from '@progress/kendo-angular-treeview';

const EMPTY_ITEM = { text: '[Empty]', placeholder: true };

@Directive({
    selector: '[emptyItemPlaceholder]'
})
export class EmptyItemPlaceholderDirective implements AfterViewInit {

    constructor(private treeview: TreeViewComponent) { }

    public ngAfterViewInit(): void {
        this.treeview.addItem.subscribe(this.handleAdd.bind(this));
        this.treeview.removeItem.subscribe(this.handleRemoveItem.bind(this));
        this.treeview.nodeDragStart.subscribe(this.handleDragStart.bind(this));
    }

    private handleAdd(event: TreeItemDropEvent): void {
        const placeholderItem = this.treeview.nodes.find(item => item.placeholder);
        if (placeholderItem) {
            // remove the empty item placeholder
            const index = this.treeview.nodes.indexOf(placeholderItem);
            this.treeview.nodes.splice(index, 1);

            // if the item was dropped into the empty item, we've just spliced it as well, so restore it back
            if (event.dropPosition === DropPosition.Over) {
                this.treeview.nodes.push(event.sourceItem.item.dataItem);
            }
        }
    }

    private handleRemoveItem(): void {
        if (this.treeview.nodes.length > 0) {
            return;
        }

        this.treeview.nodes.push(Object.assign({}, EMPTY_ITEM));
    }

    private handleDragStart(event: TreeItemDragStartEvent): void {
        if (event.sourceItem.item.dataItem.placeholder) {
            event.preventDefault();
        }
    }
}
