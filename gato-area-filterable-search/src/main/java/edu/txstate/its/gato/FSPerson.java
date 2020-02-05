package edu.txstate.its.gato;

import com.google.gson.*;

public class FSPerson {
  
  protected JsonObject user;
  
  public FSPerson(JsonObject user) {
    this.user = user;
  }
  
  public String getPreferredName() {
    if (!user.has("name")) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("preferred").getAsString();
  }
  public String getFirstName() {
    if (!user.has("name")) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("legalFirst").getAsString();
  }
  public String getLastName() {
    if (!user.has("name")) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("last").getAsString();
  }
  
  public String getNetId() {
    if (!user.has("netid")) return "";
    return user.getAsJsonPrimitive("netid").getAsString();
  }
  
  public String getOfficePhone() {
    if (!user.has("officePhone")) return "";
    return user.getAsJsonPrimitive("officePhone").getAsString();
  }
  
  public String getEmail() {
    if (!user.has("ldapAccount")) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    return ldapObj.getAsJsonPrimitive("email").getAsString();
  }
  
  public String getPosition() {
    if (!user.has("ldapAccount")) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    return ldapObj.getAsJsonPrimitive("title").getAsString();
  }
  
  public String toString() {
    return user.toString();
  }
}