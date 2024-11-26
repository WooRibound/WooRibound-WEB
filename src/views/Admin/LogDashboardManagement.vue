<script>
import { fetchLogDashboard } from "@/api/services/adminServiece";

export default {
  name: "LogDashboardManagement",
  setup() {
    const loadDashboard = async () => {
      try {
        const response = await fetchLogDashboard();
        console.log(response.data);
        if (response.data) {
          // 대시보드 URL로 이동
          window.location.href = response.data;
        }
      } catch (error) {
        console.error("fetchLogDashboard API 호출 오류:", error);
      }
    };

    return {
      loadDashboard,
    };
  },
};
</script>

<template>
  <main class="body">
    <div class="dashboard-container">
      <img class="dashboard-image" src="@/assets/images/icons/dashboard.png" alt="Dashboard Icon" />
      <button class="log-button" @click="loadDashboard">대시보드 보러가기</button>
    </div>
  </main>
</template>

<style scoped>
.body {
  display: flex;                  
  justify-content: center;       
  align-items: center;           
  height: 100vh;                  
  background-color: #f8f9fa;     
  padding: 20px;                 
  box-sizing: border-box;         
}

.dashboard-container {
  display: flex;                  
  flex-direction: column;        
  align-items: center;         
}

.dashboard-image {
  width: 220px;                  
  margin-bottom: 20px;            
}

.log-button {
  width: 200px;                
  padding: 15px;                 
  background-color: #024CAA;      
  color: white;                  
  text-align: center;             
  cursor: pointer;                
  font-size: 16px;
  font-weight: bold;             
  border-radius: 8px;           
  border: none;                 
  transition: background-color 0.2s; 
}

.log-button:hover {
  background-color: #023A86;      
}
</style>
