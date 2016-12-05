package edu.txstate.its.gato;

import edu.txstate.its.gato.setup.LinkMigrationLogic;

import info.magnolia.dam.api.Asset;
import info.magnolia.dam.api.AssetProviderRegistry;
import info.magnolia.dam.api.ItemKey;
import info.magnolia.dam.core.config.DamCoreConfiguration;
import info.magnolia.dam.core.download.DamDownloadServlet;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;

import javax.jcr.Node;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

import com.google.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatoDamServlet extends DamDownloadServlet {
	private static Logger log = LoggerFactory.getLogger(GatoDamServlet.class);
  protected final LinkMigrationLogic lmlogic;
  protected final DamTemplatingFunctions damfn;
	protected static final SimpleDateFormat httpDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);

  @Inject
  public GatoDamServlet(final DamCoreConfiguration configuration, final AssetProviderRegistry assetProviderRegistry,
    final LinkMigrationLogic linklogic, final DamTemplatingFunctions damTemplatingFunctions) {
    super(configuration, assetProviderRegistry);
    this.lmlogic = linklogic;
    this.damfn = damTemplatingFunctions;
  }

	@Override
	protected void process(HttpServletRequest req, HttpServletResponse res) throws Exception {
		// Get Asset
		Asset asset = getAsset(req);
  	String ifmodsincestr = req.getHeader("If-Modified-Since");
  	try {
  		if (!StringUtils.isBlank(ifmodsincestr)) {
				Calendar ifmodsince = parseHttpDate(ifmodsincestr);
				Calendar lastmod = asset.getLastModified();
				if (ifmodsince != null && lastmod != null && !lastmod.after(ifmodsince)) {
					res.sendError(HttpServletResponse.SC_NOT_MODIFIED);
					res.setDateHeader("Last-Modified", asset.getLastModified().getTimeInMillis());
					return;
				}
			}
		} catch (Exception e) {
			log.warn("trouble evaluating if-modified-since", e);
		}
		super.process(req, res);
	}

  @Override
  protected Asset getAsset(HttpServletRequest request) {
    lmlogic.setMigrationEnabled(false);
    String pathInfo = request.getPathInfo();
    String keyStr = pathInfo.split("/")[1];
    if (ItemKey.isValid(keyStr)) return super.getAsset(request);
    Node damItem = lmlogic.convertUrlToDamNode("/dam"+pathInfo);
    if (damItem != null) return damfn.getAsset(lmlogic.itemKeyForAssetNode(damItem));
    return super.getAsset(request);
  }

	protected Calendar parseHttpDate(String datestr) throws Exception {
		Calendar ret = Calendar.getInstance();
		ret.setTime(httpDateFormat.parse(datestr));
		return ret;
	}
}
