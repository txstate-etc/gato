#!/usr/bin/perl
use strict;
use File::Basename qw(dirname);

require(dirname(__FILE__).'/gato_restful_lib.pl');
our $path = $ARGV[3];

$|=1;
exit(main());

sub main {
  our $path;
	my $pages = query("SELECT * FROM [mgnl:page] WHERE ISDESCENDANTNODE('".$path."')", undef, 1);
	@$pages = sort { $$a{path} cmp $$b{path} } @$pages;

	print "Path,Template,Status,Modified,Modified By\n";
	for my $node ( @{$pages} ) {
		my $path = $$node{path};
    my $template = getproperty($node, 'mgnl:template');
    my $status = getproperty($node, 'mgnl:activationStatus');
    my $moddate = getproperty($node, 'mgnl:lastModified');
    my $modby = getproperty($node, 'mgnl:lastModifiedBy');
		print quoted($path).','.quoted($template).','.quoted($status).','.quoted($moddate).','.quoted($modby)."\n";
	}
}

sub quoted {
	my $str = shift;
	if ($str !~ m/,/) { return $str; }
	$str =~ s/"/\\"/g;
	return '"'.$str.'"';
}
