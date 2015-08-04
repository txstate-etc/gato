#!/usr/bin/perl
use strict;

my $tomcatdir = "tomcat";
my $superlight = $ARGV[0] eq '--super';
my $light = $ARGV[0] eq '--light';
my $fullrun = !$light && !$superlight;

if ($fullrun) {
	print "mvn clean install...\n";
	my $output = `mvn clean install`;
	if ($output =~ m/FAILURE/) { print $output."\n"; }
}

if ($light || $fullrun) {
	print "stopping tomcat...\n";
	`$tomcatdir/bin/shutdown.sh`;
}

if ($fullrun) {
	print "removing old webapp...\n";
	`rm -rf $tomcatdir/webapps/ROOT*`;

	print "copying war...\n";
	`cp magnolia-project-webapp/target/magnolia-project-webapp*war $tomcatdir/webapps/ROOT.war`;
	
	print "starting tomcat...\n";
	`$tomcatdir/bin/startup.sh`;
}

if ($light || $superlight) {
	print "removing light modules...\n";
	`rm -rf $tomcatdir/webapps/ROOT/gato-template`;
	`rm -rf $tomcatdir/webapps/ROOT/gato-template-tsus`;
}

while (!-e "$tomcatdir/webapps/ROOT") { }
print "copying light modules...\n";
`cp -R gato-template $tomcatdir/webapps/ROOT/gato-template`;
`cp -R gato-template-tsus $tomcatdir/webapps/ROOT/gato-template-tsus`;

if ($light) {
	print "starting tomcat...\n";
	`$tomcatdir/bin/startup.sh`;
}

print "Done.\n";
