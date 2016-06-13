#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $exceptions = {
		'/ktsw-radio' => 1,
		'/ktsw-radio-sandbox' => 1,
		'/ktsw-radio-sandbox-old' => 1,
		'/texas-justice-court-training-center' => 1,
		'/texas-justice-court-training-center-old' => 1,
		'/texas-justice-court-training-center-sandbox' => 1
	};

	swaptemplates('gato-template-txstate2009:pages/standard', 
		'gato-template-txstate2015:pages/standard-template', 
		$exceptions);
	swaptemplates('gato-template-txstate2009:pages/mail', 
		'gato-template-txstate2015:pages/mail-template', 
		$exceptions);

	print "finished!\n";
}

sub swaptemplates {
	my $oldtemplate = shift;
	my $newtemplate = shift;
	my $exceptions = shift;
	
	my $json = query("select * from [mgnl:page] where [mgnl:template] = '".$oldtemplate."'");

	for my $node ( @{$json} ) {
		$$node{path} =~ /^(\/[^\/]*)/;
		my $site = $1;
		if (!$$exceptions{$site}) {
			print "swapping ".$$node{path}." from 2009 to 2015...";
			if (setproperty($node, 'mgnl:template', $newtemplate)) {
				print "SUCCESS!\n";
			} else {
				print "FAILED!\n";
			}
		}
	}
}
