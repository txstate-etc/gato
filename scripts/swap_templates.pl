#!/usr/bin/perl
use strict;

use LWP::UserAgent qw//;
use JSON::XS qw//;
use URI::Escape;

our $server = $ARGV[1] || 'http://localhost:8080';
our $username = $ARGV[2] || 'superuser';
our $password = $ARGV[3] || 'superuser';
our $ua = LWP::UserAgent->new( keep_alive => 1, timeout => 60 );

$|=1;
exit(main());

sub main {
	my $exceptions = {
		'/ktsw-radio' => 1,
		'/texas-justice-court-training-center' => 1
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
