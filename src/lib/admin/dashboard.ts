import "server-only";

import { listAdminAppointments, countNewAppointments } from "@/lib/admin/appointments";
import {
  countActiveProjects,
  listAdminProjects,
  listApproachingProjects,
} from "@/lib/admin/projects";

export async function getAdminDashboardData() {
  const [
    activeProjects,
    newAppointments,
    approachingProjects,
    recentProjects,
    recentAppointments,
  ] = await Promise.all([
    countActiveProjects(),
    countNewAppointments(),
    listApproachingProjects(),
    listAdminProjects("", 5),
    listAdminAppointments(5),
  ]);

  return {
    activeProjects,
    newAppointments,
    approachingProjects,
    recentProjects,
    recentAppointments,
  };
}
