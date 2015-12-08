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

import com.google.inject.Inject;

public class GatoDamServlet extends DamDownloadServlet {
  protected final LinkMigrationLogic lmlogic;
  protected final DamTemplatingFunctions damfn;

  @Inject
  public GatoDamServlet(final DamCoreConfiguration configuration, final AssetProviderRegistry assetProviderRegistry,
    final LinkMigrationLogic linklogic, final DamTemplatingFunctions damTemplatingFunctions) {
    super(configuration, assetProviderRegistry);
    this.lmlogic = linklogic;
    this.damfn = damTemplatingFunctions;
  }

  @Override
  protected Asset getAsset(HttpServletRequest request) {
    String pathInfo = request.getPathInfo();
    String keyStr = pathInfo.split("/")[1];
    if (ItemKey.isValid(keyStr)) return super.getAsset(request);
    Node damItem = lmlogic.convertUrlToDamNode(pathInfo);
    if (damItem != null) return damfn.getAsset(lmlogic.urlForAssetNode(damItem));
    return super.getAsset(request);
  }

}
