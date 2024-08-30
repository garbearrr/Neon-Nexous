
export class BaseModule implements IBaseModule {
    private destroyed: boolean = false;

    public Destroy() {
        this.destroyed = true;
    }

    public isDestroyed() {
        return this.__nooverrideIsDestroyed();
    }

    private __nooverrideIsDestroyed() {
        return this.destroyed;
    }
}