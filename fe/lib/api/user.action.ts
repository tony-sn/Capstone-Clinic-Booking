// client-side functions (no "use server")
import { Endpoints } from "@/lib/app.config";
import type { User } from "@/types/user";

// Client-side function for hooks
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('🚀 Client: Fetching users from:', Endpoints.USERS);
       console.log('🔧 Environment:', process.env.NEXT_PUBLIC_ENDPOINT);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/Admin/users-with-roles`, {
      cache: "no-store",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Client fetch failed:', res.status, errorText);
      throw new Error(`Failed to fetch users: ${res.status}`);
    }
    
    const data: User[] = await res.json();
    console.log('✅ Client: Users fetched successfully:', data.length);
    return data;
  } catch (error) {
    console.error("❌ Client fetch error:", error);
    return [];
  }
};

// Client-side function to get doctors
export const getAllDoctor = async (): Promise<User[]> => {
  try {
    console.log('👨‍⚕️ Client: Getting doctors...');
    
    const users = await getAllUsers();
    
    // Filter only users with "Doctor" role
    const doctors = users.filter(user => 
      user.roles && user.roles.includes("Doctor")
    );
    
    console.log('👨‍⚕️ Client: Doctors filtered:', doctors.length, 'doctors found');
    return doctors;
  } catch (error) {
    console.error("❌ Client: Error getting doctors:", error);
    return [];
  }
};

// Helper function to filter users by role  
export const getUsersByRole = (users: User[], role: string): User[] => {
  const filtered = users.filter(user => 
    user.roles && user.roles.includes(role)
  );
  console.log(`👥 Client: Users with role '${role}':`, filtered.length);
  return filtered;
};

// Debug function for testing
export const testClientFetch = async () => {
  console.log('🧪 Testing client-side fetch...');
  console.log('📡 Endpoint URL:', Endpoints.USERS);
  
  try {
    const users = await getAllUsers();
    const doctors = getUsersByRole(users, "Doctor");
    const patients = getUsersByRole(users, "User");
    
    console.log('📊 Test Results:');
    console.log('Total users:', users.length);
    console.log('Doctors:', doctors.length);
    console.log('Patients:', patients.length);
    
    return { users, doctors, patients };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
};