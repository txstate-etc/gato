package edu.txstate.its.gato.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
 
import org.codehaus.jackson.JsonNode;

public interface SmCacheService {  
  @GET
  @Path("/all")
  @Produces(MediaType.APPLICATION_JSON)
  JsonNode all();
}
