package edu.txstate.its.gato;

import info.magnolia.ui.admincentral.dialog.action.SaveDialogAction;
import info.magnolia.ui.api.action.ActionExecutionException;
import info.magnolia.ui.form.EditorCallback;
import info.magnolia.ui.form.EditorValidator;

import com.vaadin.data.Item;

public class SaveFaqDialogAction<T extends SaveFaqDialogActionDefinition> extends SaveDialogAction<T> {

    public SaveFaqDialogAction(T definition, Item item, EditorValidator validator, EditorCallback callback) {
        super(definition, item, validator, callback);
    }

    @Override
    public void execute() throws ActionExecutionException {
        // TODO: Add custom faq save handler stuff
        super.execute();
    }
}
