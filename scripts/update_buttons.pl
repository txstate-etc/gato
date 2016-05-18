#!/usr/bin/perl
use strict;

use LWP::UserAgent qw//;
use JSON::XS qw//;
use URI::Escape;
require('gato_restful_lib.pl');

our $server = $ARGV[1] || 'http://localhost:8080';
our $username = $ARGV[2] || 'superuser';
our $password = $ARGV[3] || 'superuser';
our $ua = LWP::UserAgent->new( keep_alive => 1, timeout => 60 );

$|=1;
exit(main());

sub main {
	my $json = query("select * from [mgnl:component] where [mgnl:template] = 'gato-component-button:components/button'");

	for my $node ( @{$json} ) {
		print "evaluating button component at ".$$node{path}."\n";
		my $target = getproperty($node, 'url');
		if (!is_uuid($target) && !is_external_link($target)) {
			my $targetednode = get('/nodes/v1/website'.$target);
			
			if (!$targetednode) {
				my $site = grab_site($$node{path});
				$target =~ s/\/[^\/]*/$site/;
				$targetednode = get('/nodes/v1/website'.$target);
			}
			
			if ($$targetednode{id}) {
				print "converting url from path to UUID...";
				if (setproperty($node, 'url', $$targetednode{id})) {
					print "SUCCESS!\n";
				} else {
					print "FAILED!\n";
				}
			}
		}
	}

	print "finished!\n";
}

sub grab_site {
	my $path = shift;
	if ($path =~ m/^(\/[^\/]*)/) { return $1; }
	return '/';
}

sub is_uuid {
	my $str = shift;
	return ($str =~ m/^[a-f0-9\-]+$/i);
}

sub is_external_link {
	my $str = shift;
	return ($str =~ m/^(\w+:)?\/\/.*$/i);
}

