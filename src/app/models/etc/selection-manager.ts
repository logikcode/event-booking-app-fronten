export abstract class SelectionManager<E, I> {

    private selected: Map<string | number, I> = new Map();

    public abstract getIdentifier(e: E): string | number;

    public abstract getState(e: E): I;

    public isSelectable(e: E): boolean {
        return true;
    }

    public refreshSelection(list: E[]) {
        list.forEach(it => {
            if (!this.isSelectable(it)) {
                this.deselect(it);
            } else if (this.isSelected(it)) {
                this.select(it);
            }
        });
    }

    public getSelections(): I[] {
        return Array.from(this.selected.values());
    }

    public getIdentifiers(): (string | number)[] {
        return Array.from(this.selected.keys());
    }

    public selectionSize() {
        return this.selected.size;
    }

    public clearSelection() {
        this.selected.clear();
    }

    public toggleAll(list: E[]) {
        // console.log(list);
        const selectable = list.filter(it => this.isSelectable(it));
        if (!selectable.length) {
            return false;
        }
        if (this.allSelected(selectable)) {
            list.forEach(it => this.deselect(it));
        } else {
            selectable.filter(it => !this.isSelected(it)).forEach(it => this.select(it));
        }
    }

    public allSelected(list: E[]) {
        const selectable = list.filter(it => this.isSelectable(it));
        if (!selectable.length) {
            return false;
        }
        return !selectable.filter(it => !this.isSelected(it)).length;
    }

    public isSelected(bill: E) {
        return this.selected.get(this.getIdentifier(bill));
    }

    public toggleSelection(bill: E) {
        if (this.isSelected(bill)) {
            this.deselect(bill);
        } else {
            this.select(bill);
        }
    }

    private deselect(bill: E) {
        this.selected.delete(this.getIdentifier(bill));
    }

    private select(bill: E) {
        if (!this.isSelectable(bill)) {
            return;
        }
        this.selected.set(this.getIdentifier(bill), this.getState(bill));
    }
}
