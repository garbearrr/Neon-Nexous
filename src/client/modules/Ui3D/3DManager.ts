// Ui3DManager.ts
import { Ui3DPage } from "./3DPage";
import { LinkedList } from "shared/modules/LinkedList/LinkedList";

export namespace Ui3DManager {
    const NewPageOffset = 0.25; // Offset between pages
    const PageYOffset = -0.5;

    const Pages = new LinkedList<Ui3DPage>();
    const ZI = 100000;
    let FocusedPage: Ui3DPage | undefined;

    export const Activate = () => {
        Pages.ForEach((Page) => {
            Page.Activate();
        });
    }


    export const AddPage = (Page: Ui3DPage) => {
        const pageCount = Pages.GetSize();
        const offsetX = pageCount * NewPageOffset;
        const dist = Page.GetDistance() + pageCount;

        Page
            .SetPositionOffset(new Vector2(offsetX, PageYOffset))
            .SetDistance(dist);

        // Activate the page
        Page.Activate();

        // Set up click detection to set focus
        Page.OnClicked(() => {
            SetFocusedPage(Page);
        });

        Pages.Add(Page);
        Page.SetZIndex(ZI - pageCount);

        // If this is the first page, set it as focused
        if (Pages.GetSize() === 1) {
            SetFocusedPage(Page);
        }
    };

    const SetFocusedPage = (Page: Ui3DPage) => {
        if (FocusedPage !== Page) {
            if (FocusedPage) {
                FocusedPage.SetFocused(false);
            }
            FocusedPage = Page;
            Page.SetFocused(true);
        }
    };
}
