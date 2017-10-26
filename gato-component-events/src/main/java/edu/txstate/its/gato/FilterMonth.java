package edu.txstate.its.gato;

public class FilterMonth {
  protected String key;
  protected String name;
  public FilterMonth(String key, String name) {
    this.key = key;
    this.name = name;
  }
  public String getKey() { return key; }
  public String getName() { return name; }
}
