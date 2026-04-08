export const SolanaSupportedTools = ({ chainId }) => {
  const [chains, setChains] = useState(null);
  const [tools, setTools] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.delora.build/v1/chains")
      .then((r) => r.json())
      .then((d) => setChains(d.chains))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    fetch("https://api.delora.build/v1/tools")
      .then((r) => r.json())
      .then(setTools)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!chains || !tools) return <div>Loading...</div>;

  const selectedChainId = Number(chainId);

  const chainById = (id) => chains.find((c) => Number(c.id) === Number(id));

  const renderChains = (connectedChains) => (
    <div className="flex flex-wrap gap-3">
      {connectedChains.map((chain) => (
        <div key={chain.id} className="relative group">
          <img
            src={chain.logoURI}
            alt={chain.name}
            className="w-6 h-6 rounded-full not-prose"
          />
          <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
            {chain.name}
          </div>
        </div>
      ))}
    </div>
  );

  const toolChains = (tool) =>
    tool.supportedChains
      .map(chainById)
      .filter(Boolean)
      .sort((a, b) => Number(a.id) - Number(b.id));

  const bridges = tools.bridges
    .filter((bridge) => bridge.supportedChains.map(Number).includes(selectedChainId))
    .map((bridge) => ({
      ...bridge,
      connectedChains: toolChains(bridge).filter(
        (chain) => Number(chain.id) !== selectedChainId
      ),
    }))
    .filter((bridge) => bridge.connectedChains.length)
    .sort((a, b) => b.connectedChains.length - a.connectedChains.length);

  const exchanges = tools.exchanges
    .filter((exchange) =>
      exchange.supportedChains.map(Number).includes(selectedChainId)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <h2>Supported Bridges</h2>

      {bridges.length === 0 ? (
        <p>-</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Supported Chains</th>
            </tr>
          </thead>
          <tbody>
            {bridges.map((bridge) => (
              <tr key={bridge.key}>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={bridge.logoURI}
                      className="w-4 h-4 rounded-full not-prose"
                      alt={bridge.name}
                    />
                    <strong>{bridge.name}</strong>
                  </div>
                </td>

                <td>
                  <code>{bridge.key}</code>
                </td>

                <td>{renderChains(bridge.connectedChains)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Supported Exchanges</h2>

      {exchanges.length === 0 ? (
        <p>-</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => (
              <tr key={exchange.key}>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={exchange.logoURI}
                      className="w-4 h-4 rounded-full not-prose"
                      alt={exchange.name}
                    />
                    <strong>{exchange.name}</strong>
                  </div>
                </td>

                <td>
                  <code>{exchange.key}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
