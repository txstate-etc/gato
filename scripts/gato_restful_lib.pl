use LWP::UserAgent qw//;
use JSON::XS qw//;
use URI::Escape;

our $server = $ARGV[0] || 'http://localhost:8080';
our $username = $ARGV[1] || 'superuser';
our $password = $ARGV[2] || 'superuser';
our $ua = LWP::UserAgent->new( keep_alive => 1, timeout => 60 );
our $default_repo = 'website';

sub query {
	my $query = shift;
	my $repository = shift || $default_repo;
	$ret = get('/query/v1/'.$repository.'/JCR-SQL2?query='.uri_escape($query));
	if (ref($ret) eq "ARRAY") { return $ret; }
	return [];
}

sub get {
	my $endpoint = shift;
	my $silence_errors = shift;
	my $req = HTTP::Request->new(GET => $server.'/.rest'.$endpoint);
	$req->authorization_basic($username, $password);
	#print "get ".$req->uri."\n";
	my $resp = $ua->request($req);
	#print "complete\n";
	if ( $resp->is_success ) {
		if ($resp->decoded_content =~ m/Texas State NetID Login/) {
			print "Authentication failed.\n";
		} else {
			return JSON::XS->new->utf8->decode($resp->decoded_content);
		}
	} else { 
		if (!$silence_errors) {
			print "failed get with status ".$resp->code." from ".$req->uri.", response:\n";
			print $resp->decoded_content."\n\n";
		}
	}
	return {};
}

sub post {
	my $endpoint = shift;
	my $jsonstring = shift;
	my $req = HTTP::Request->new(POST => $server.'/.rest'.$endpoint);
	$req->authorization_basic($username, $password);
	$req->content($jsonstring);
	$req->header("Content-Type", "application/json");
	#print "post ".$req->uri."...";
	my $resp = $ua->request($req);
	#print "complete\n";
	if ( $resp->is_success ) {
		return $resp->decoded_content;
	} elsif ($resp->code == 302 && $req->uri =~ m/^http:/ && $resp->header('Location') =~ m/^https:/) {
		print	"\nyou are being redirected to https, are you trying to update edit on http?\n";
		return 'failed';
	} else { 
		print "\nfailed post with status ".$resp->code." to ".$req->uri.", request body:\n";
		print $resp->header('Location')."\n";
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
	my ($node, $propname, $propvalue, $proptype, $repository) = @_;
	$repository = $default_repo unless $repository;
	my $obj = {
		properties => [{
			name => $propname,
			type => $proptype||'String',
			values => [
				$propvalue
			]
		}]
	};
	my $json = post('/nodes/v1/'.$repository.$$node{path}, JSON::XS->new->utf8->encode($obj));
	return ($json ne 'failed');
}

sub trim {
	my $str = shift;
	$str =~ s/^\s+|\s+$//g;
	return $str;
}

return 1;