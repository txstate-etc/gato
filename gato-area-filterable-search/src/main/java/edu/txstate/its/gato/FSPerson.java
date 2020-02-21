package edu.txstate.its.gato;

import com.google.gson.*;

public class FSPerson {

  protected JsonObject user;

  public FSPerson(JsonObject user) {
    this.user = user;
  }

  public String getPreferredName() {
    if (!user.has("name")|| (user.get("name") instanceof JsonNull)) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("preferred").getAsString();
  }
  public String getFirstName() {
    if (!user.has("name") || (user.get("name") instanceof JsonNull)) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("legalFirst").getAsString();
  }
  public String getLastName() {
    if (!user.has("name") || (user.get("name") instanceof JsonNull)) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    return nameObj.getAsJsonPrimitive("last").getAsString();
  }

  public String getNetId() {
    if (!user.has("netid") || (user.get("netid") instanceof JsonNull)) return "";
    return user.getAsJsonPrimitive("netid").getAsString();
  }

  public String getOfficePhone() {
    if (!user.has("officePhone") || (user.get("officePhone") instanceof JsonNull)) return "";
    return user.getAsJsonPrimitive("officePhone").getAsString();
  }

  public String getEmail() {
    if (!user.has("ldapAccount") || (user.get("ldapAccount") instanceof JsonNull)) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    return ldapObj.getAsJsonPrimitive("email").getAsString();
  }

  public String getPosition() {
    if (!user.has("ldapAccount") || (user.get("ldapAccount") instanceof JsonNull)) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    return ldapObj.getAsJsonPrimitive("title").getAsString();
  }
  
  public void setOfficeLocation(String office) {
    user.addProperty("officeLocation", office);
  }
  
  public String getOfficeLocation() {
    if (!user.has("officeLocation")) return "";
    return user.getAsJsonPrimitive("officeLocation").getAsString();
  }

  public void setImagePath(String image) {
    user.addProperty("imagePath", image);
  }

  public String getImagePath() {
    if (!user.has("imagePath")) return "";
    return user.getAsJsonPrimitive("imagePath").getAsString();
  }

  public void setFaceDetected(boolean detected) {
    user.addProperty("faceDetected", detected);
  }

  public boolean getFaceDetected() {
    if (!user.has("faceDetected")) return false;
    return user.getAsJsonPrimitive("faceDetected").getAsBoolean();
  }

  public void setFaceAspect(double aspect) {
    user.addProperty("faceAspect", aspect);
  }

  public double getFaceAspect() {
    if (!user.has("faceAspect")) return -1;
    return user.getAsJsonPrimitive("faceAspect").getAsDouble();
  }

  public void setFaceLeft(double left) {
    user.addProperty("faceLeft", left);
  }

  public double getFaceLeft() {
    if (!user.has("faceLeft")) return 0;
    return user.getAsJsonPrimitive("faceLeft").getAsDouble();
  }

  public void setFaceTop(double top) {
    user.addProperty("faceTop", top);
  }

  public double getFaceTop() {
    if (!user.has("faceTop")) return 0;
    return user.getAsJsonPrimitive("faceTop").getAsDouble();
  }

  public void setFaceWidth(double width) {
    user.addProperty("faceWidth", width);
  }

  public double getFaceWidth() {
    if (!user.has("faceWidth")) return 0;
    return user.getAsJsonPrimitive("faceWidth").getAsDouble();
  }

  public void setDmid(String dmid) {
    user.addProperty("dmid", dmid);
  }

  public String getDmid() {
    if (!user.has("dmid")) return "";
    return user.getAsJsonPrimitive("dmid").getAsString();
  }

  public String toString() {
    return user.toString();
  }
}