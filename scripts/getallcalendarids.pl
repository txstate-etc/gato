#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $json = query("SELECT * FROM [mgnl:component] WHERE [mgnl:template]='gato-component-events:components/events'");

	for my $node ( @{$json} ) {
		my $path = $$node{path};
		$path =~ s/"/\\"/g;
		print '"'.$$node{path}.'",';
		my $target = getproperty($node, 'calendarId');
		print '"'.$target."\"\n";
	}

	print "finished!\n";
}
