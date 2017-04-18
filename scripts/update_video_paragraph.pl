#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');

$|=1;
exit(main());

sub main {
	my $json = query("select * from [mgnl:component] where [mgnl:template] = 'gato-component-streaming:components/streaming' and [videourl] like '%iframe%'");

	for my $node ( @{$json} ) {
		print "evaluating video component at ".$$node{path}."\n";
		my $target = getproperty($node, 'videourl');
		my $newtarget = "";
		if ($target =~ m/player\.vimeo\.com\/video\/(\d+)/) {
			$newtarget = "https://vimeo.com/".$1;
		} elsif ($target =~ m/youtube\.com\/embed\/([\w\-]+)/) {
			$newtarget = "https://youtu.be/".$1;
		}
		if ($newtarget) {
			print "want to change ".$target." to ".$newtarget."\n";
			if (setproperty($node, 'videourl', $newtarget)) {
			  print "SUCCESS!\n";
			} else {
			  print "FAILURE!\n";
			}
		} else {
			print "it wasn't supported: ".$target."\n";
		}
	}

	print "finished!\n";
}
