import React from "react";
import axios from "axios";
import { render, fireEvent } from "@testing-library/react";
import BingSearch from "../BingSearch";

jest.mock("axios", () => {
  return {
    get: jest.fn().mockResolvedValue({ data: {} }),
  };
});

describe("BingSearch", () => {
  it("should display the input field and search button", () => {
    const { getByPlaceholderText, getByText } = render(<BingSearch />);

    expect(getByPlaceholderText("Search")).toBeInTheDocument();
    expect(getByText("Search")).toBeInTheDocument();
  });

  it("should display the results when the user enters a query and clicks the search button", async () => {
    axios.get.mockResolvedValue({
      data: {
        _type: "type",
        webPages: {
          value: [
            { name: "Google", url: "https://google.com" },
            { name: "Facebook", url: "https://facebook.com" },
          ],
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(<BingSearch />);

    const input = getByPlaceholderText("Search");
    const searchButton = getByText("Search");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(searchButton);

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.bing.microsoft.com/v7.0/search/?q=test",
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "197f790b9cff4f558fad905ddd421227f13",
        },
      }
    );

    const results = await getByText("Google").closest("li");

    expect(results).toBeInTheDocument();
  });

  it("should display an error message when the API request fails", async () => {
    axios.get.mockRejectedValue(new Error("An error occurred"));

    const { getByPlaceholderText, getByText } = render(<BingSearch />);

    const input = getByPlaceholderText("Search");
    const searchButton = getByText("Search");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(searchButton);

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.bing.microsoft.com/v7.0/search/?q=test",
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "197f790b9cff4f558fad905ddd421227f13",
        },
      }
    );

    const error = await getByText("An error occurred");

    expect(error).toBeInTheDocument();
  });
});
