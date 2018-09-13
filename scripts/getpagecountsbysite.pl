#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $json = query("SELECT * FROM [mgnl:page] as p WHERE ISCHILDNODE(p, '/')");

	for my $node ( @{$json} ) {
		my $path = $$node{path};
		$path =~ s/"/\\"/g;
		print '"'.$$node{path}.'",';
		my $subnodes = query("SELECT [jcr:uuid] FROM [mgnl:page] as p WHERE ISDESCENDANTNODE(p, '".$path."')");
		print (scalar(@{$subnodes})+1);
		print "\n";
	}
}
