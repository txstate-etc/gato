#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $emergencytree = get('/nodes/v1/website/emergency-response/emergencysituations?depth=100&excludeNodeTypes=mgnl:area');
	my $ret = [];
	walkpagetree($emergencytree, $ret);
	print JSON::XS->new->utf8->encode($ret);
}

sub walkpagetree {
	my $node = shift;
	my $ret = shift;
	push @$ret, urlfromnode($node);
	for my $page ( @{$$node{nodes}} ) {
		if ($$page{type} eq 'mgnl:page') {
			walkpagetree($page, $ret);
		}
	}
}

sub urlfromnode {
	my $node = shift;
	my $path = $$node{path};
	$path =~ s/^\/[^\/]+//i;
	return 'http://www.emergencyinfo.txstate.edu'.$path.'.txt';
}
