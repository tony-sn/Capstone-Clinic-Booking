function PatientPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">View your appointment records</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Appointments History</h2>
            </div>
            <div className="mt-6">
              <p className="py-8 text-center text-muted-foreground">
                Your appointments will be displayed here.
                <br />
                This section will show your appointments and their statuses{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientPage;
