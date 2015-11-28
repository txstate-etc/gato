package edu.txstate.its.gato.setup;

import java.io.InputStream;
import javax.jcr.Node;
import org.apache.commons.io.IOUtils;
import org.devlib.schmidt.imageinfo.ImageInfo;

public class ImageSize {

  private long width;
  private long height;

  public ImageSize() {
    this(0, 0);
  }

  public ImageSize(long defaultwidth, long defaultheight) {
    this.width = defaultwidth;
    this.height = defaultheight;
  }

  public ImageSize(InputStream is) {
    this();
    loadStream(is);
  }

  public ImageSize(InputStream is, long defaultwidth, long defaultheight) {
    this(defaultwidth, defaultheight);
    loadStream(is);
  }

  public ImageSize(Node nodeResource, long defaultwidth, long defaultheight) {
    this(defaultwidth, defaultheight);
    try {
      loadStream(nodeResource.getProperty("jcr:data").getBinary().getStream());
    } catch (Exception e) {  }
  }

  public void loadStream(InputStream is) {
    try {
      ImageInfo info = new ImageInfo();
      info.setInput(is);
      if (info.check()) {
        this.width = info.getWidth();
        this.height = info.getHeight();
      }
    } finally {
      IOUtils.closeQuietly(is);
    }
  }

  public long getWidth() {
    return width;
  }

  public long getHeight() {
    return height;
  }
}
