package edu.txstate.its.gato.setup;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.PathNotFoundException;
import javax.jcr.LoginException;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.delta.TaskExecutionException;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MigrateToTrumbaTask extends GatoBaseUpgradeTask {
  private static final Logger log = LoggerFactory.getLogger(MigrateToTrumbaTask.class);

  public MigrateToTrumbaTask() {
    super("Migrate event content type to Trumba", "Map calendars in our old system to calendars in Trumba so that event content types continue to function");
  }

  protected String etcToTrumba(String calendarId) {
    if (calendarId.equals("//common-experience")) return "1414990";
    if (calendarId.equals("//general-events")) return "1400280";
    if (calendarId.equals("//graduate-college")) return "1415000";
    if (calendarId.equals("//honors-college")) return "1415001";
    if (calendarId.equals("//volleyball")) return "1401428";
    if (calendarId.equals("/academic-calendar-and-holidays")) return "";
    if (calendarId.equals("/academic-calendar-and-holidays/academic-calendar")) return "";
    if (calendarId.equals("/College of Science and Engineering")) return "";
    if (calendarId.equals("/College of Science and Engineering/department-of-chemistry-and-biochemistry-meta-calendar/department-of-chemistry-and-biochemistry")) return "1414994";
    if (calendarId.equals("/College of Science and Engineering/department-of-mathematics")) return "1414996";
    if (calendarId.equals("/College of Science and Engineering/department-of-physics")) return "1414997";
    if (calendarId.equals("/college-of-applied-arts/school-of-social-work")) return "";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar")) return "1414986";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/department-of-theatre-and-dance")) return "1414992";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/department-of-theatre-and-dance/theatre")) return "1414992";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/friends-front-and-center")) return "1414986";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/school-of-art-and-design-meta-calendar/mfa-communication-design")) return "1414986";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/school-of-journalism-and-mass-communication-meta-calendar/school-of-journalism-and-mass-communication")) return "";
    if (calendarId.equals("/college-of-fine-arts-meta-calendar/school-of-music-meta-calendar")) return "1415010";
    if (calendarId.equals("/college-of-health-professions-meta-calendar/school-of-social-work")) return "";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar")) return "1414988";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/anthropology")) return "1414982";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/center-for-the-study-of the-southwest")) return "1414985";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/department-of-geography")) return "1414988";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/department-of-psychology")) return "1415008";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/history")) return "1415003";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/modern-languages")) return "1415007";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/modern-languages-meta-calendar/french-at-texas-state")) return "1415007";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/modern-languages-meta-calendar/german-at-texas-state")) return "1415007";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/modern-languages-meta-calendar/modern-languages")) return "1415007";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/philosophy")) return "1415008";
    if (calendarId.equals("/college-of-liberal-arts-meta-calendar/writing-center")) return "1415019";
    if (calendarId.equals("/division-of-academic-affairs-meta-calendar")) return "";
    if (calendarId.equals("/division-of-academic-affairs-meta-calendar/enrollment-management-and-marketing/undergraduate-admissions")) return "1416056";
    if (calendarId.equals("/division-of-academic-affairs-meta-calendar/international-office/international-minds")) return "";
    if (calendarId.equals("/division-of-finance-and-support-services-meta-calendar/professional-development")) return "1415009";
    if (calendarId.equals("/division-of-information-technology-meta-calendar")) return "1411156";
    if (calendarId.equals("/division-of-information-technology-meta-calendar/alkek-library")) return "1411150";
    if (calendarId.equals("/division-of-information-technology-meta-calendar/alkek-library/library-hours")) return "1411151";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/campus-recreation")) return "1414983";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/career-services")) return "1414984";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/department-of-housing-and-residential-life")) return "1414995";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/lbj-student-center-meta")) return "1415005";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/lbj-student-center-meta/weeks-of-welcome")) return "1415005";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/student-health-center")) return "1415014";
    if (calendarId.equals("/division-of-student-affairs-meta-calendar/student-success")) return "1415015";
    if (calendarId.equals("/division-of-university-advancement/community-relations")) return "";
    if (calendarId.equals("/graduate-college-meta-calendar/graduate-college-funding")) return "1415001";
    if (calendarId.equals("/graduate-college-meta-calendar/graduate-college-shop-talks")) return "1415002";
    if (calendarId.equals("/mccoy-college-of-business-meta-calendar")) return "1415006";
    if (calendarId.equals("/mccoy-college-of-business-meta-calendar/mccoy-college-of-business-graduate-programs")) return "1415006";
    if (calendarId.equals("/mccoy-college-of-business-meta-calendar/mccoy-graduate-student-association")) return "1415006";
    if (calendarId.equals("/mccoy-college-of-business-meta-calendar/small-business-development-center")) return "1415011";
    if (calendarId.equals("/office-of-the-president/equity-and-access/alliance-at-texas-state-university")) return "";
    if (calendarId.equals("/office-of-the-provost/academic-development-and-assessment")) return "";
    if (calendarId.equals("/office-of-the-provost/research-and-federal-relations/the-meadows-center")) return "1415017";
    if (calendarId.equals("/round-rock-higher-education-center-meta-calendar")) return "1410395";
    if (calendarId.equals("/round-rock-higher-education-center-meta-calendar/round-rock-higher-education-center")) return "1410395";
    if (calendarId.equals("/university-college")) return "1415018";
    if (calendarId.equals("/university-college/pace")) return "1415018";
    if (calendarId.equals("/university-college/university-college")) return "1415018";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Education+Meta+Calendar%2FCollege+of+Education")) return "";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Fine+Arts+Meta+Calendar")) return "1414986";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Fine+Arts+Meta+Calendar%2FDepartment+of+Art+and+Design")) return "1414986";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Fine+Arts+Meta+Calendar%2FSchool+of+Journalism+and+Mass+Communication")) return "";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Fine+Arts+Meta+Calendar%2FSchool+of+Music+Meta+Calendar%2FSchool+of+Music")) return "1415010";
    if (calendarId.equals("%2Fpublic%2FCollege+of+Fine+Arts+Meta+Calendar%2FSchool+of+Music+Meta+Calendar%2FStudent+Recitals")) return "1415010";
    if (calendarId.equals("%2Fpublic%2FDivision+of+Student+Affairs+Meta+Calendar%2FCareer+Services")) return "1414984";
    if (calendarId.equals("%2Fpublic%2FDivision+of+Student+Affairs+Meta+Calendar%2FLBJ+Student+Center+Meta%2FLBJ+Student+Center")) return "1415005";
    if (calendarId.equals("%2Fpublic%2FDivision+of+Student+Affairs+Meta+Calendar%2FStudent+Health+Center")) return "1415014";
    if (calendarId.equals("%2Fpublic%2FRound+Rock+Higher+Education+Center+Meta+Calendar%2FRound+Rock+Professional+Development")) return "1410395";
    return "";
  }

  protected void doExecute(InstallContext ctx) throws RepositoryException, PathNotFoundException, TaskExecutionException, LoginException {
    Session s=ctx.getJCRSession(RepositoryConstants.WEBSITE);
    visitByTemplate(s, "gato-component-events:components/events", n -> {
      String calendarId = PropertyUtil.getString(n, "calendarId", "");
      String newId = etcToTrumba(calendarId);
      PropertyUtil.setProperty(n, "calendarId", newId);
    });
  }
}
