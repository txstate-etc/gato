#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	swaptemplates('gato-template-txstate2015:pages/standard-template',
		'gato-template-mobilefirst:pages/standard',
		'newsroom-sandbox');
	swaptemplates('gato-template-txstate2015:pages/mail-template',
	  'gato-template-mobilefirst:pages/mail',
		'newsroom-sandbox');

	print "finished!\n";
}

sub swaptemplates {
	my $oldtemplate = shift;
	my $newtemplate = shift;
	my $site = shift;

	my $json = query("SELECT * FROM [mgnl:page] as p WHERE p.[mgnl:template] = '".$oldtemplate."' AND ISDESCENDANTNODE(p, '/".$site."')");

	for my $node ( @{$json} ) {
		print "swapping ".$$node{path}." from $oldtemplate to $newtemplate...";
		if (setproperty($node, 'mgnl:template', $newtemplate)) {
			print "SUCCESS!\n";
		} else {
			print "FAILED!\n";
		}
	}
}
