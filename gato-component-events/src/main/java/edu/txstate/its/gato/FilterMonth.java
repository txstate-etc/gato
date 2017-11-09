package edu.txstate.its.gato;

public class FilterMonth {
  protected String key;
  protected String name;
  protected long count;
  public FilterMonth(String key, String name, long count) {
    this.key = key;
    this.name = name;
    this.count = count;
  }
  public String getKey() { return key; }
  public String getName() { return name; }
  public long getCount() { return count; }
}
