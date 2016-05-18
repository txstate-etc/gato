sub query {
	my $query = shift;
	return get('/query/v1/website/JCR-SQL2?query='.uri_escape($query));
}

sub get {
	my $endpoint = shift;
	my $req = HTTP::Request->new(GET => $server.'/.rest'.$endpoint);
	$req->authorization_basic($username, $password);
	#print "get ".$req->uri."...";
	my $resp = $ua->request($req);
	#print "complete\n";
	if ( $resp->is_success ) {
		return JSON::XS->new->utf8->decode($resp->decoded_content);
	} else { 
		print "failed get with status ".$resp->code." from ".$req->uri.", response:\n";
		print $resp->decoded_content."\n\n";
		return {};
	}
}

sub post {
	my $endpoint = shift;
	my $jsonstring = shift;
	my $req = HTTP::Request->new(post => $server.'/.rest'.$endpoint);
	$req->authorization_basic($username, $password);
	$req->content($jsonstring);
	$req->header("Content-Type", "application/json");
	#print "post ".$req->uri."...";
	my $resp = $ua->request($req);
	#print "complete\n";
	if ( $resp->is_success ) {
		return $resp->decoded_content;
	} else { 
		print "failed posting to ".$req->uri.", request body:\n";
		print $req->content."\n";
		print "response:\n";
		print $resp->decoded_content."\n\n";
		return "failed"; 
	}
}

# do NOT use this method for multi-value properties
sub getproperty {
	my $node = shift;
	my $propname = shift;
	for my $property (@{$$node{properties}}) {
		if ($$property{name} eq $propname) { 
			return trim($$property{'values'}[0]);
		}
	}
	return '';
}

sub setproperty {
	my ($node, $propname, $propvalue, $proptype) = @_;
	my $obj = {
		properties => [{
			name => $propname,
			type => $proptype||'String',
			values => [
				$propvalue
			]
		}]
	};
	my $json = post('/nodes/v1/website'.$$node{path}, JSON::XS->new->utf8->encode($obj));
	return ($json ne 'failed');
}

sub trim {
	my $str = shift;
	$str =~ s/^\s+|\s+$//g;
	return $str;
}

return 1;