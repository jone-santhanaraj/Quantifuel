import asyncio
import websockets
import json
import time

PUMP_ID = "15b7e9-6f8c"  # Unique pump identifier
BACKEND_URL = "ws://localhost:8080"

# LED States
LED_STATUS = {
    "red": True,  # Always ON when pump script is running
    "green": False,  # ON when pump is available
    "yellow": False,  # ON when transaction is in progress
    "blue": False,  # ON when fuel is being dispensed
}


async def handshake_with_backend():
    """Performs handshake with the backend to register this pump"""
    async with websockets.connect(BACKEND_URL) as websocket:
        # Send handshake request
        handshake_request = json.dumps({"action": "handshake", "pump_id": PUMP_ID})
        await websocket.send(handshake_request)

        # Wait for acknowledgment
        response = await websocket.recv()
        data = json.loads(response)

        if data.get("status") == "ACK":
            print(f"Quantifuel ~pump : Handshake successful for Pump {PUMP_ID}")
            return True
        else:
            print("Quantifuel ~pump : Handshake failed. Exiting...")
            return False


async def pump_main():
    """Main function to manage pump operations"""
    if not await handshake_with_backend():
        return

    async with websockets.connect(BACKEND_URL) as websocket:
        LED_STATUS["green"] = True  # Pump is available
        print("Quantifuel ~pump : Connected to backend, pump is now available.")

        while True:
            try:
                message = await websocket.recv()
                command = json.loads(message)

                if command["action"] == "start_transaction":
                    LED_STATUS["green"] = False
                    LED_STATUS["yellow"] = True
                    print("Quantifuel ~pump : Transaction started.")

                elif command["action"] == "start_pumping":
                    LED_STATUS["blue"] = True
                    print("Quantifuel ~pump : Fuel dispensing...")

                elif command["action"] == "stop_pumping":
                    LED_STATUS["blue"] = False
                    print("Quantifuel ~pump : Fuel dispensing stopped.")

                elif command["action"] == "complete_transaction":
                    LED_STATUS["yellow"] = False
                    LED_STATUS["green"] = True
                    print("Quantifuel ~pump : Transaction completed. Ready for next.")

                elif command["action"] == "shutdown":
                    print("Quantifuel ~pump : Pump shutting down...")
                    break

            except websockets.exceptions.ConnectionClosed:
                print("Quantifuel ~pump : Lost connection to backend. Reconnecting...")
                time.sleep(5)
                await pump_main()  # Reconnect
                break


# Run the pump script
asyncio.run(pump_main())
