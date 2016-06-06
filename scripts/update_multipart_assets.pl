#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');
our $default_repo = "dam";

$|=1;
exit(main());

sub main {
	my $json = query("select * from [mgnl:resource] where [extension]='pdf' and [jcr:mimeType] like 'multipart%'");

	for my $node ( @{$json} ) {
		print "evaluating resource at ".$$node{path}."...";
		if (setproperty($node, 'jcr:mimeType', 'application/pdf')) {
			print "SUCCESS!\n";
		}
	}
	print "finished!\n";
}
