package edu.txstate.its.gato;

import com.google.gson.*;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.PhoneNumberUtil.PhoneNumberFormat;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

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
  public String getPronouns() {
    if (!user.has("name") || (user.get("name") instanceof JsonNull)) return "";
    JsonObject nameObj = user.getAsJsonObject("name");
    if (!nameObj.get("pronouns").isJsonNull()) {
      return nameObj.getAsJsonPrimitive("pronouns").getAsString();
    } else return "";
  }

  public String getNetId() {
    if (!user.has("netid") || (user.get("netid") instanceof JsonNull)) return "";
    return user.getAsJsonPrimitive("netid").getAsString();
  }

  public String getOfficePhone() {
    if (!user.has("officePhone") || (user.get("officePhone") instanceof JsonNull)) return "";
    if (user.get("officePhone").isJsonNull()) return "";
    String phone = user.getAsJsonPrimitive("officePhone").getAsString();
    PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
    try {
      PhoneNumber num = phoneUtil.parse(phone, "US");
      return phoneUtil.format(num, PhoneNumberFormat.NATIONAL);
    } catch(Exception e) {
      e.printStackTrace();
      return "";
    }
  }

  public String getEmail() {
    if (!user.has("ldapAccount") || (user.get("ldapAccount") instanceof JsonNull)) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    if (!ldapObj.get("email").isJsonNull()) {
      return ldapObj.getAsJsonPrimitive("email").getAsString();
    } else return "";
  }

  public String getPosition() {
    if (!user.has("ldapAccount") || (user.get("ldapAccount") instanceof JsonNull)) return "";
    JsonObject ldapObj = user.getAsJsonObject("ldapAccount");
    if (!ldapObj.get("title").isJsonNull()) {
      return ldapObj.getAsJsonPrimitive("title").getAsString();
    } else return "";
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

  public void setBiography(String bio) {
    user.addProperty("biography", bio);
  }
  public String getBiography() {
    if (!user.has("biography")) return "";
    return user.getAsJsonPrimitive("biography").getAsString();
  }

  public void setTeachingInterests(String teaching) {
    user.addProperty("teachingInterests", teaching);
  }

  public String getTeachingInterests() {
    if (!user.has("teachingInterests")) return "";
    return user.getAsJsonPrimitive("teachingInterests").getAsString();
  }

  public void setResearchInterests(String research) {
    user.addProperty("researchInterests", research);
  }

  public String getResearchInterests() {
    if (!user.has("researchInterests")) return "";
    return user.getAsJsonPrimitive("researchInterests").getAsString();
  }

  public String toString() {
    return user.toString();
  }
}
