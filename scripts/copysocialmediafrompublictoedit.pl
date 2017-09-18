#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my @sites = ('testing-site-destroyer');

	foreach my $site (@sites) {
		my $sm = get('/nodes/v1/website/'.$site.'/socialmedia?depth=500');
		if ($sm->{'name'}) {
			postrecursive($sm);
		}
	}

	print "finished!\n";
}

sub postrecursive {
	my $node = shift;
	my $path = $node->{'path'};
	foreach my $child (@{$node->{'nodes'}}) {
		my $childpath = $child->{'path'};
		my $childnodes = $child->{'nodes'};
		delete $child->{'path'};
		delete $child->{'nodes'};
		my $c = get('/nodes/v1/website'.$childpath, 0, 'http://gato-edit1.its.txstate.edu:8081');
		if ($c->{'name'}) {
			print "updating\n";
			post('/nodes/v1/website'.$childpath, JSON::XS->new->utf8->encode($child), 'http://gato-edit1.its.txstate.edu:8081');
		} else {
			print "creating\n";
			post('/nodes/v1/website'.$path, JSON::XS->new->utf8->encode($child), 'http://gato-edit1.its.txstate.edu:8081', 'PUT');
		}
		$child->{'path'} = $childpath;
		$child->{'nodes'} = $childnodes;
		postrecursive($child);
	}
}
