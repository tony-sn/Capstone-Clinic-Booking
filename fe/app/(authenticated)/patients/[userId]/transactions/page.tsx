import { requireSpecificPatient } from "@/lib/auth-guard";

export default async function PatientTransactionsPage({
  params,
}: {
  params: { userId: string };
}) {
  // Ensure only the specific patient can access their own transactions
  await requireSpecificPatient(params.userId);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Transactions</h1>
          <p className="text-muted-foreground">
            View your payment history and transaction records
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm text-card-foreground">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment History</h2>
            </div>
            <div className="mt-6">
              <p className="text-center text-muted-foreground py-8">
                Your transaction history will be displayed here.
                <br />
                This section will show your payments, invoices, and billing
                information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
