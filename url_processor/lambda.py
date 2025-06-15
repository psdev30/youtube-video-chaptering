import os
import runpod
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize RunPod API
api_key = os.getenv('RUNPOD_API_KEY')
if not api_key:
    raise Exception("RunPod API key not found in environment variables")

runpod.api_key = api_key

def get_available_gpus():
    """Get available GPU instances from RunPod"""
    try:
        # Get all available pods
        pods = runpod.get_pods()
        
        # Filter for available GPU instances
        available_gpus = [
            pod for pod in pods 
            if pod['runtime']['gpuCount'] > 0 and pod['runtime']['status'] == 'RUNNING'
        ]
        
        return available_gpus
    except Exception as e:
        print(f"Error getting GPU instances: {e}")
        return []

def process_video(video_url):
    """Process a video using RunPod"""
    try:
        # Get available GPUs
        gpus = get_available_gpus()
        if not gpus:
            raise Exception("No available GPU instances found")
        
        # Use the first available GPU
        gpu = gpus[0]
        
        # Create a job on the GPU
        job = runpod.create_job(
            pod_id=gpu['id'],
            input={
                "video_url": video_url
            }
        )
        
        return {
            "status": "success",
            "job_id": job['id'],
            "gpu_instance": gpu['id']
        }
        
    except Exception as e:
        print(f"Error processing video: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

if __name__ == "__main__":
    # Test the code
    test_url = "https://www.youtube.com/watch?v=test"
    # result = process_video(test_url)
    # print(result)
    print(runpod.api_key)