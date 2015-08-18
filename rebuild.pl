#!/usr/bin/perl
use strict;
use Cwd;

my $gatodir = cwd();
my $tomcatdir = $gatodir."/tomcat";
my @lightmodules = ('gato-template', 'gato-template-tsus', 'gato-template-txstate2015');
my $module = "";
if ($ARGV[0] eq '--module') {
	$module = $ARGV[1];
}

if ($module) {
	print "building individual module $module...\n";
	chdir($gatodir.'/'.$module);
} else {
	chdir($gatodir);
}

print "mvn clean package...\n";
my $output = `mvn clean package`;
if ($output =~ m/FAILURE/) { print $output."\n"; }

print "stopping tomcat...\n";
`$tomcatdir/bin/shutdown.sh`;

if (!$module) {
	print "removing old webapp...\n";
	`rm -rf $tomcatdir/webapps/ROOT*`;

	print "copying war...\n";
	`cp $gatodir/gato-webapp/target/gato-webapp*war $tomcatdir/webapps/ROOT.war`;
} else {
	print "copying module jar to webapp...\n";
	`rm $tomcatdir/webapps/ROOT/WEB-INF/lib/$module*.jar`;
	`cp $gatodir/$module/target/$module*.jar $tomcatdir/webapps/ROOT/WEB-INF/lib/`;
}

print "starting tomcat...\n";
`$tomcatdir/bin/startup.sh`;

if (!$module) {
	print "waiting to symlink light modules...\n";
	my $tries = 0;
	while (1) { 
		sleep(1);
		my $allpresent = 1;
		foreach my $lm (@lightmodules) {
			$allpresent = 0 unless -e "$tomcatdir/webapps/ROOT/$lm";
		}
		last if $allpresent || $tries++ > 60;
	}
	sleep(1); # just for good measure
	
	print "symlinking light modules...\n";
	`rm -rf $tomcatdir/webapps/ROOT/gato-*`;
	foreach my $lm (@lightmodules) {
		`ln -s $gatodir/$lm $tomcatdir/webapps/ROOT/$lm`;
	}
}

print "Done.\n";
