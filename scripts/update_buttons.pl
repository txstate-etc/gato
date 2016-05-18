#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $json = query("select * from [mgnl:component] where [mgnl:template] = 'gato-component-button:components/button'");

	for my $node ( @{$json} ) {
		print "evaluating button component at ".$$node{path}."\n";
		my $target = getproperty($node, 'url');
		if (!is_uuid($target) && !is_external_link($target) && $target =~ m/^\//) {
			my $targetednode = get('/nodes/v1/website'.$target, 1);
			
			if (!%{$targetednode}) {
				my $site = grab_site($$node{path});
				$target =~ s/\/[^\/]*/$site/;
				print "trying a new target $target...\n";
				$targetednode = get('/nodes/v1/website'.$target, 1);
			}
			
			if (%{$targetednode}) {
				print "converting url from path to UUID...";
				if (setproperty($node, 'url', $$targetednode{identifier})) {
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

