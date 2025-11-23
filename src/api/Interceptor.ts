/* eslint-disable @typescript-eslint/no-explicit-any */
// implement a method to execute all the request from here.
const apiRequest = async (
    method: string,
    url: string,
    request?: any,
) => {
    let options = {
        method: method,
        body: JSON.stringify(request),
        headers: { accept: "application/json", "content-type": "application/json" }
    }

    const response = await fetch(url, options);

    const responseJSON = await response.json();

    return responseJSON;

};


// function to execute the http get request
const get = async (
    url: string,
    request?: any
) => await apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = async (
    url: string,
    request?: any
) => await apiRequest("delete", url, request);

// function to execute the http post request
const post = async (
    url: string,
    request?: any
) => await apiRequest("post", url, request);

// function to execute the http put request
const put = async (
    url: string,
    request?: any
) => await apiRequest("put", url, request);

// function to execute the http path request
const patch = async (
    url: string,
    request: any
) => await apiRequest("patch", url, request);

// expose your method to other services or actions
const API = {
    get,
    delete: deleteRequest,
    post,
    put,
    patch
};
export default API;