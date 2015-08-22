#!/usr/bin/perl
use strict;
use Cwd;

our $gatodir = cwd();
our $tomcatdir = $gatodir."/tomcat";
our @lightmodules = ('gato-template', 'gato-template-tsus', 'gato-template-txstate2015');
our $module = "";
if ($ARGV[0] eq '--module') {
	$module = $ARGV[1];
} elsif ($ARGV[0] eq '--light') {
	tomcat_restart(sub {
		print "copying light modules...\n";
		`rm -rf $tomcatdir/webapps/ROOT/gato-*`;
		foreach my $lm (@lightmodules) {
			`cp -R $gatodir/$lm $tomcatdir/webapps/ROOT/$lm`;
		}
	});
	print "Done.\n";
	exit;
}

if ($module) {
	print "building individual module $module...\n";
	chdir($gatodir.'/'.$module);
} else {
	chdir($gatodir);
}

print "mvn clean package...\n";
my $output = `mvn clean package`;
if ($output =~ m/FAILURE/) { print $output."\n"; exit; }

tomcat_restart(sub {
	if (!$module) {
		print "removing old webapp...\n";
		`rm -rf $tomcatdir/webapps/ROOT*`;
		print "copying war...\n";
		`cp $gatodir/gato-webapp/target/gato-webapp*war $tomcatdir/webapps/ROOT.war`;
	} else {
		print "removing old $module jar...\n";
		`rm $tomcatdir/webapps/ROOT/WEB-INF/lib/$module*.jar`;
		print "copying new $module jar to webapp...\n";
		`cp $gatodir/$module/target/$module*.jar $tomcatdir/webapps/ROOT/WEB-INF/lib/`;
	}
});

print "Done.\n";

sub tomcat_restart {
	my $nested = shift;
	
	print "stopping tomcat...\n";
	`$tomcatdir/bin/shutdown.sh`;

	my $matchstr = quotemeta($tomcatdir);
	while (`ps ax` =~ m/$matchstr/) {
		print "waiting for tomcat to go away...\n";
		sleep(1);
	}
	
	$nested->();
	
	print "starting tomcat...\n";
	`$tomcatdir/bin/startup.sh`;
}