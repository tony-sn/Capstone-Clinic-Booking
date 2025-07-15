import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async () => {
  const appointments = (await getRecentAppointmentList()) || {
    documents: [
      {
        patient: {
          userId: 1,
          name: "Tony",
          email: "tonychopper@gmail.com",
          phone: "+84913342231",
          birthDate: "12/11/1988",
          gender: "male",
          address: "16 Johnson St",
          occupation: "Software Engineer",
          emergencyContactName: "Nancy",
          emergencyContactNumber: "123456789",
          primaryPhysician: "Dr. John Doe",
        },
        schedule: "01/07/2025",
        status: "pending",
        primaryPhysician: "Dr. John Doe",
        reason: "Checkup",
        note: "No note",
        userId: 1,
        cancellationReason: null,
      },
    ],
  };

  return (
    <>
      {/* <div className="mx-auto flex max-w-7xl flex-col space-y-14"> */}
      {/*   <header className="admin-header"> */}
      {/*     <Link href="/" className="cursor-pointer"> */}
      {/*       <Image */}
      {/*         src="/assets/icons/logo-full.svg" */}
      {/*         height={32} */}
      {/*         width={162} */}
      {/*         alt="logo" */}
      {/*         className="h-8 w-fit" */}
      {/*       /> */}
      {/*     </Link> */}
      {/**/}
      {/*     <p className="text-16-semibold">Admin Dashboard</p> */}
      {/*   </header> */}
      {/**/}
      {/*   <main className="admin-main"> */}
      <section className="w-full space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">
          Start the day with managing new appointments
        </p>
      </section>

      <section className="admin-stat">
        <StatCard
          type="appointments"
          count={appointments?.scheduledCount || 1}
          label="Scheduled appointments"
          icon={"/assets/icons/appointments.svg"}
        />
        <StatCard
          type="pending"
          count={appointments?.pendingCount || 1}
          label="Pending appointments"
          icon={"/assets/icons/pending.svg"}
        />
        <StatCard
          type="cancelled"
          count={appointments?.cancelledCount || 1}
          label="Cancelled appointments"
          icon={"/assets/icons/cancelled.svg"}
        />
      </section>

      <DataTable columns={columns} data={appointments.documents} />
      {/* </main> */}
      {/*  </div> */}
    </>
  );
};

export default AdminPage;
