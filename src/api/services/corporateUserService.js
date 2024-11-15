import handleApiCall from "@/api/apiService";

// 사용 예시 (다른 파일에서 이 함수를 가져와 사용할 수 있음)
// import { fetchData, postData, updateData, deleteData } from '@/api/CorporateUserService';

// 기업 회원 정보 조회
export const fetchEnterprise = async () => {
  try {
    const response = await handleApiCall("get", "/corporate/info", null);
    return response.data;
  } catch (error) {
    console.error("fetchEnterprise API 호출 오류:", error);
    throw error;
  }
};

// 기업회원 정보 수정
export const updateEnterpriseInfo = async (updatedInfo) => {
  try {
    const response = await handleApiCall("post", '/corporate/info/update', updatedInfo);
    return response;
  } catch (error) {
    console.error("updateEnterpriseInfo API 호출 오류:", error);
    throw error;
  }
};

// PUT 요청 함수
export const updateData = async (id, payload) => {
  try {
    const response = await handleApiCall(
      "put",
      `/your/api/endpoint/${id}`,
      payload
    );
    console.log(response);
    return response; // 응답을 반환
  } catch (error) {
    console.error("Error updating data:", error);
    throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
  }
};

// DELETE 요청 함수
export const deleteData = async (id) => {
  try {
    const response = await handleApiCall("delete", `/your/api/endpoint/${id}`);
    console.log(response);
    return response; // 응답을 반환
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
  }
};
