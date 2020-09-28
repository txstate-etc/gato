package edu.txstate.its.gato;

import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.ui.form.field.definition.SelectFieldOptionDefinition;
import info.magnolia.ui.form.field.factory.SelectFieldFactory;

import com.google.gson.*;

import org.apache.commons.io.IOUtils;

import java.net.URL;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.v7.data.Item;


public class DepartmentSelectorFieldFactory extends SelectFieldFactory<DepartmentSelectorDefinition> {

    private static final Logger log = LoggerFactory.getLogger(DepartmentSelectorFieldFactory.class);
    protected String deptUrl;

    //@Inject
    public DepartmentSelectorFieldFactory(DepartmentSelectorDefinition definition, Item relatedFieldItem) {
        super(definition, relatedFieldItem);
        this.deptUrl = Components.getComponent(MagnoliaConfigurationProperties.class).getProperty('gato.peoplesearch.dept_url');
    }

    //Get the options (list of departments) for the select field
    @Override
    public List<SelectFieldOptionDefinition> getSelectFieldOptionDefinition() {
        List<SelectFieldOptionDefinition> res = new ArrayList<SelectFieldOptionDefinition>();

        try {
          String json = IOUtils.toString(new URL(this.deptUrl).openStream());
          JsonObject resultsObj = new JsonParser().parse(json).getAsJsonObject();
          JsonArray results = resultsObj.get("results").getAsJsonArray();
          for (JsonElement elem : results) {
            SelectFieldOptionDefinition option = new SelectFieldOptionDefinition();
            JsonObject departmentObj = elem.getAsJsonObject();
            String department = departmentObj.get("name").getAsString();
            if(department.length() > 0) {
              option.setValue(department);
              option.setLabel(department);
              res.add(option);
            }
          }
        } catch(Exception e) {
          e.printStackTrace();
        }
        return res;
    }


    @Override
    protected Class<?> getDefaultFieldType() {
        return String.class;
    }

}
