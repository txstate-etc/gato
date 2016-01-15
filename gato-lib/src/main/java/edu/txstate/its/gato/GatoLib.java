package edu.txstate.its.gato;

/**
 * This class is optional and represents the configuration for the gato-lib module.
 * By exposing simple getter/setter/adder methods, this bean can be configured via content2bean
 * using the properties and node from <tt>config:/modules/gato-lib</tt>.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoLib {
    /* you can optionally implement info.magnolia.module.ModuleLifecycle */

    public static final String WS_GATOAPPS = "gatoapps";

}
