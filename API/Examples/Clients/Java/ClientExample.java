import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class ClientExample {
    public static void main(String[] args) throws Exception {
        String endpoint = "http://api.iclikval.riken.jp/annotation";
        URL url         = new URL(endpoint);

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("User-Agent", "MyApp/1.0");
        // Replace the access token beow with real one
        conn.setRequestProperty("Authorization", "Bearer xxxxxxxxxxxxxxxxxxxxxxxx");

        try {
            int responseCode = conn.getResponseCode();

            String line;
            BufferedReader buffer = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuffer response = new StringBuffer();

            while ((line = buffer.readLine()) != null) {
                response.append(line);
            }

            buffer.close();
            System.out.println(response.toString());
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }
    }
}
